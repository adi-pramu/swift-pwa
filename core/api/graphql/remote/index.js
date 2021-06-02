/* eslint-disable no-console */
const fetch = require('cross-fetch');
const { print } = require('graphql');
const { wrapSchema, introspectSchema } = require('@graphql-tools/wrap');
const { graphqlEndpoint, storeCode } = require('../../../../swift.config');
const { decrypt } = require('../../../helpers/encryption');
const { getAppEnv } = require('../../../helpers/env');

const executor = async ({
    document, variables, context,
}) => {
    try {
        let token = '';
        if (context) {
            token = context.headers.authorization || context.session.token;
        }
        const query = print(document);
        const appEnv = getAppEnv();
        const additionalHeader = {};
        if (storeCode) {
            additionalHeader.store = storeCode;
        }
        const url = graphqlEndpoint[appEnv] || graphqlEndpoint.prod;
        if (token && token !== '') {
            additionalHeader.Authorization = `Bearer ${decrypt(token)}`;
        }
        const fetchResult = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...additionalHeader,
            },
            body: JSON.stringify({ query, variables }),
        });
        const response = await fetchResult.json();
        if (response.errors) {
            const err = response.errors[0];
            if (err.extensions.category === 'graphql-authorization') {
                return {
                    errors: [
                        {
                            message: err.extensions.category,
                            extensions: err.extensions,
                        },
                    ],
                    data: response.data,
                };
            }
            return {
                errors: [
                    {
                        message: err.message,
                        extensions: err.extensions,
                    },
                ],
                data: response.data,
            };
        }
        return response;
    } catch (error) {
        console.error('There was an uncaught error', error);
        // process.exit(1); // mandatory (as per the Node docs)
        return false;
    }
};

module.exports = async () => {
    const schema = wrapSchema({
        schema: await introspectSchema(executor),
        executor,
    });

    return schema;
};
