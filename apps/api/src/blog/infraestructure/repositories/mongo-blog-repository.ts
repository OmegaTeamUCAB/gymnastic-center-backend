import { InjectModel } from "@nestjs/mongoose";
import { BlogRepository } from "../../domain/repositories/blog.repository";
import { MongoBlog } from "../models/blog.model";
import { Model } from "mongoose";
import { Blog } from "../../domain/blog";

export class MongoBlogRepository implements BlogRepository {
    constructor( @InjectModel(MongoBlog.name) private readonly datasource: Model<Blog> ) {}
    
    async createBlog(data: Blog): Promise<void> {
        console.log("Data: ",data)

        await this.datasource.create(data)

        await this.datasource.updateOne({
            aggregateId: data.id
        },
        {
            $set: {
                imageUrl: data.imageUrl,
                title: data.title,
                description: data.description,
                content: data.content,
                uploadDate: data.uploadDate,
            }
        },
        {
            upsert: true,
        })

        return;
    }
}