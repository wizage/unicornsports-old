/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createStreamKey = /* GraphQL */ `
  mutation CreateStreamKey($id: ID) {
    createStreamKey(id: $id) {
      id
      title
      description
      streamKey
      channelArn
      streamURL
      streamKeyArn
      ingestEndpoint
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createChannel = /* GraphQL */ `
  mutation CreateChannel(
    $input: CreateChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    createChannel(input: $input, condition: $condition) {
      id
      title
      description
      streamKey
      channelArn
      streamURL
      streamKeyArn
      ingestEndpoint
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateChannel = /* GraphQL */ `
  mutation UpdateChannel(
    $input: UpdateChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    updateChannel(input: $input, condition: $condition) {
      id
      title
      description
      streamKey
      channelArn
      streamURL
      streamKeyArn
      ingestEndpoint
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteChannel = /* GraphQL */ `
  mutation DeleteChannel(
    $input: DeleteChannelInput!
    $condition: ModelChannelConditionInput
  ) {
    deleteChannel(input: $input, condition: $condition) {
      id
      title
      description
      streamKey
      channelArn
      streamURL
      streamKeyArn
      ingestEndpoint
      createdAt
      updatedAt
      owner
    }
  }
`;
