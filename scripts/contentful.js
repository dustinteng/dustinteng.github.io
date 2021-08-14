let client

// Initialization of contentful client
export const init = () => {
  client = contentful.createClient({
    space: 'h1c7cglxonah',
    accessToken: 'qB1zHSAfoAXDamVSw4z3pr-LBSyVEjn3JZhwYI1YOyc'
  })
}

// export const getWorkExperiences = () => {
//   return client.getEntries({
//     "content_type": "workExperiences",
//     "order": "-fields.startingDate"
//   })
// }

// export const getEducations = () => {
//   return client.getEntries({
//     "content_type": "educations",
//     "order": "-fields.startingDate"
//   })
// }

// export const getProjects = () => {
//   return client.getEntries({
//     "content_type": "projects",
//     "order": "-fields.startingDate"
//   })
// }

export const getShowcases = () => {
  return client.getEntries({
    "content_type": "showcase",
    "order": "-fields.order"
  })
}