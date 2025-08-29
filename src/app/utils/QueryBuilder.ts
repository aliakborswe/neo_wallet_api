/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";
import { excludeField } from "../constants/constants";

// Add your numeric fields here
const numericFields = ["amount"];

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, any>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, any>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      filter[field] = undefined;
    }

    // Convert numeric fields to numbers if present and valid
    for (const field of numericFields) {
      if (filter[field] !== undefined) {
        const num = Number(filter[field]);
        if (!isNaN(num)) {
          filter[field] = num;
        } else {
          filter[field] = undefined;
        }
      }
    }

    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    const searchQuery: any = {
      $or: searchableField
        .filter((field) => {
          // Only include numeric fields if searchTerm is a valid number
          if (numericFields.includes(field)) {
            return !isNaN(Number(searchTerm));
          }
          return true;
        })
        .map((field) => {
          if (numericFields.includes(field)) {
            return { [field]: Number(searchTerm) };
          }
          return { [field]: { $regex: searchTerm, $options: "i" } };
        }),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);
    return { page, limit, total: totalDocuments, totalPage };
  }
}
