/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const rotateStreamKey = /* GraphQL */ `
  mutation RotateStreamKey($channelID: ID) {
    rotateStreamKey(channelID: $channelID) {
      id
      channelID
      title
      description
      streamKey
      channelArn
      streamURL
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
      channelID
      title
      description
      streamKey
      channelArn
      streamURL
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
      channelID
      title
      description
      streamKey
      channelArn
      streamURL
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
      channelID
      title
      description
      streamKey
      channelArn
      streamURL
      createdAt
      updatedAt
      owner
    }
  }
`;
