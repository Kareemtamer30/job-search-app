import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type User {
        _id: ID!
        firstName: String
        lastName: String
        email: String
        mobileNumber: String
        role: String
        bannedAt: String
    }

    type Company {
        _id: ID!
        companyName: String
        companyEmail: String
        industry: String
        approvedByAdmin: Boolean
        bannedAt: String
    }

    type Query {
        getAllData: [User]
        getAllCompanies: [Company]
    }
`);