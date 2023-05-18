
import React from "react";
import {Client} from "@notionhq/client";
import {BlockObjectResponse, PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";


export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const fetchPages = React.cache(() => {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        filter: {
            property: "Status",
            status: {
                equals: "Published"
            }
        }
    })
        .then((res) => (res.results as PageObjectResponse[]).map((page) => (
        {
            id: page.id,
            title: page.properties.Title.title[0].plain_text,
            description: page.properties.Description.rich_text[0].plain_text,
            status: page.properties.Status.status.name,
            date: page.properties.Date.date.start,
            slug: page.properties.Slug.rich_text[0].plain_text,
            created_time: page.properties["Created time"].created_time,
            content: page.properties.Content?.rich_text[0]?.plain_text,
        })));
})

export const fetchPageBySlug = React.cache((slug: string) => {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        filter: {
            property: "Slug",
            rich_text: {
                equals: slug
            }
        }
    })
        .then((res) => res.results[0] as PageObjectResponse)
        .then((page) => {
            return {
                id: page.id,
                title: page.properties.Title.title[0].plain_text,
                description: page.properties.Description.rich_text[0].plain_text,
                status: page.properties.Status.status.name,
                date: page.properties.Date.date.start,
                slug: page.properties.Slug.rich_text[0].plain_text,
                created_time: page.properties["Created time"].created_time,
                content: page.properties.Content?.rich_text[0]?.plain_text,
            }
        })
});

export const fetchPageBlocks = React.cache((pageId: string) => {
    return notion.blocks.children
        .list({
            block_id: pageId,
        })
        .then((res) => res.results as BlockObjectResponse[]);
})