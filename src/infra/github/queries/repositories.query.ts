export const REPOSITORIES_QUERY = /* GraphQL */ `
  query Repositories($login: String!, $after: String) {
    user(login: $login) {
      repositories(
        first: 100
        after: $after
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          pushedAt
          primaryLanguage {
            name
          }
        }
      }
    }
  }
`;
