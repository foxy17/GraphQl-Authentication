const jsonwebtoken = require('jsonwebtoken')
const models = require('../models')
const { Op } = require("sequelize");
require('dotenv').config({ path: '../.env' })

const resolvers = {
    Query: {
        async getUserList(root, args, { user }) {
            try {
                if(!user) throw new Error('You are not authenticated!')
                const {search,pagination,sort} =args;
                var query={
                    offset:0,
                    limit:5,
                    raw: true,
                    //this is done to flaten out the join command
                    attributes: ['firstName','lastName','email','employeeId','Company.company',],
                    include: [{ model: models.Company,attributes:[]}]
                    }
                    //by defaults query is paginated to limit 5 items
                if(pagination){
                    query.limit=pagination.items;
                    query.offset=pagination.items*(pagination.page-1)
                }
                if(search){
                    query.where={
                        [Op.or]: [
                            search.firstName?{ firstName: search.firstName }:null,
                            search.lastName?{ lastName: search.lastName}:null,
                            search.employeeId?{ employeeId: search.employeeId}:null
                        ] 
                    }
                }
                if(sort){
                    query.order= [
                        [sort, 'ASC'],
                    ];
                }
                return await models.User.findAll(query);
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },

    Mutation: {
        async registerUser(root, { firstName, lastName, email, password, employeeId,company }) {
            try {
                const userCheck = await models.User.findOne({ 
                    where: { 
                        [Op.or]: [
                            { email: email },
                            { employeeId: employeeId }
                    ] 
                }})
                if (userCheck) {
                    throw new Error('Email or Employee id already exists')
                }
                const user = await models.User.create({
                    firstName,
                    lastName,
                    employeeId,
                    email,
                    password: password
                })
                const companyModel = await models.Company.create({
                    employeeId,
                    company
                })
                const token = jsonwebtoken.sign(
                    { employeeId: user.employeeId, email: user.email},
                    process.env.JWT_SECRET,
                    { expiresIn: '1y' }
                )

                return {
                    token, employeeId: companyModel.employeeId, firstName: user.firstName, email: user.email, message: "Registration succesfull"
                }
            } catch (error) {
                throw new Error(error.message)
            }
        },

        async login(_, { email, password }) {
            try {
                const user = await models.User.findOne({ where: { email }})

                if (!user) {
                    throw new Error('No user with that email')
                }
                const isValid = await models.User.validPassword(password, user.password)
                if (!isValid) {
                    throw new Error('Incorrect password')
                }

                // return jwt
                const token = jsonwebtoken.sign(
                    { employeeId: user.employeeId, email: user.email},
                    process.env.JWT_SECRET,
                    { expiresIn: '1d'}
                )
                
                return {
                   token, user
                }
            } catch (error) {
                throw new Error(error.message)
            }
        }

    },


}

module.exports = resolvers