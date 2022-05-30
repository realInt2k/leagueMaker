import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
  } from "@apollo/client";

/*
No, Game tile, Type, Created, Live On, State (Waiting, Playing, Done, Canceled)
*/

class LeagueList {
    client:any;
    constructor(){
        this.client = new ApolloClient({
            uri : process.env.REACT_APP_graphqlEndPoint,
            cache: new InMemoryCache()
        });
    }
    async getList()
    {
        let list: any;
        //console.log("in the graphQLLIST THING", process.env.REACT_APP_graphqlEndPoint);
        await this.client
            .query({
                query: gql`
                {
                    leagues {
                        id,
                        game {
                            name
                        },
                        openTime,
                        liveTime,
                        closeTime,
                    }
                }
                `
            })
            .then((result: any) => {
                list = result;
            });
        return list.data;
    }
}

export default LeagueList;