export const PROFILE_QUERY = /* GraphQL */ `
  query Profile($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      company
      location
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(ownerAffiliations: OWNER, privacy: PUBLIC) {
        totalCount
      }
    }
  }
`;
