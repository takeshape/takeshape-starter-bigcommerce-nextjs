import { GraphQLClient } from "graphql-request";
export { gql } from "graphql-request";
export { getImageUrl } from "@takeshape/routing";

// We provide a thin wrapper around a configured GraphQL client

export class Client {
  constructor(endpoint, key) {
    this.key = key;
    this.endpoint = endpoint;
    this.client = new GraphQLClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${this.key}`,
      },
    });
  }
  async graphql(query, variables) {
    return this.client.request(query, variables);
  }
}

// We create and provide a singleton TakeShape client as our default export
let ts;
function createClient() {
  if (!ts) {
    ts = new Client(process.env.TAKESHAPE_ENDPOINT, process.env.TAKESHAPE_KEY);
  }
  return ts;
}
export default createClient();
