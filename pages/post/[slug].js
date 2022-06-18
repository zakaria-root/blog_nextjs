import NavBare from "../../components/Header/Header"
import { sanityClient } from "../../sanity"

export default function Post({ post, params }) {
  console.log(post)

  return (
    <div>
      
      <NavBare/>
    </div>
  )
}

export async function getStaticPaths() {
  const query = `*[_type =="post" ]{
    _id,
    slug{current}
  }
  `
  const posts = await sanityClient.fetch(query)
  
  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  console.log("paths");

  return {
    paths,
    fallback: "blocking",
  }
}

export async function getStaticProps({ params }) {

  const query = `*[_type =="post" && slug.current == $slug ][0]{
    _id,
    title,
    mainImage,
    description,
    slug,
    author -> {
  image,
    name
  },
  categories,
  }
  `
  const post = await sanityClient.fetch(query, {
    slug: params?.slug
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
      params
    },
  }
}
