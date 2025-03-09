import { UserModel } from "../../models/user.model.js";
import { CompanyModel } from "../../models/company.model.js";

export const resolvers = {
    Query: {
        getAllData: async () => {
            const users = await UserModel.find();
            const companies = await CompanyModel.find();
            return [...users, ...companies];
        },
        getAllCompanies: async () => {
            return await CompanyModel.find();
        },
    },
};