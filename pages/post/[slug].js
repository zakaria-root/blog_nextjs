import Header from "../../components/Header/Header"
import { sanityClient, urlFor } from "../../sanity"
import styles from "../../styles/Home.module.css"
import { PortableText } from "@portabletext/react"
import { useForm } from "react-hook-form"

export default function Post({ post }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  function onSubmit(data) {
    console.log(data);
  }
  return (
    <>
      <Header>
        <main className={styles.main}>
          <div className="container">
            <div className="">
              <img
                style={{ objectFit: "cover" }}
                src={urlFor(post.mainImage).url()}
                alt="not image banner"
                width="100%"
                height="200"
              />
            </div>

            <PortableText
              value={post.body}
              components={() => ({
                block: {
                  // Ex. 1: customizing common block types
                  h1: ({ children }) => (
                    <h1 className="text-2xl">{children}</h1>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-purple-500">
                      {children}
                    </blockquote>
                  ),

                  // Ex. 2: rendering custom styles
                  customHeading: ({ children }) => (
                    <h2 className="text-lg text-primary text-purple-700">
                      {children}
                    </h2>
                  ),
                },
              })}
            />
            <hr
              style={{
                marginTop: "2em",
                padding: "0.08em",
                color: "orange",
                borderRadius: "10px",
                marginInline: "15%",
              }}
            />
            <div className="row">
              <form
                onSubmit={handleSubmit(onSubmit)}
                class="border-light col-md-10 offset-1 py-5"
                action="#!"
              >
                <p>
                  <a className="text-warning" href="" target="_blank">
                    Enjoyed this article
                  </a>
                </p>
                <p class="h1 mb-4">Leave a commente below!</p>
                <hr className="mb-5" />

                <input
                  type="hidden"
                  value={post._id}
                  name="_id"
                  {...register("_id")}
                />
                <div class="form-group purple-border">
                  <label for="exampleFormControlTextarea4">
                    <h6>Name</h6>
                  </label>
                  <input
                    {...register("name", { required: true })}
                    class="form-control p-3 mb-4"
                    id={styles.input}
                    rows="3"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                   <div class="alert alert-danger" role="alert">
                   The name field is required!
                 </div>
                  )}
                </div>

                <div class="form-group purple-border">
                  <label for="exampleFormControlTextarea4">
                    <h6>Email</h6>
                  </label>
                  <input
                    {...register("email", { required: true })}
                    class="form-control p-3 mb-4"
                    rows="3"
                    placeholder="Enter your email"
                    id={styles.input}
                  />
                  {errors.email && (
                    <div class="alert alert-danger" role="alert">
                    The email field is required!
                  </div>
                  )}
                </div>

                <div class="form-group purple-border">
                  <label for="exampleFormControlTextarea4">
                    <h6>Comment</h6>
                  </label>
                  <textarea
                    {...register("comment", { required: true })}
                    class="form-control mb-4"
                    rows="3"
                    placeholder="Enter your comment"
                    id={styles.input}
                  ></textarea>
                  {errors.comment && (
                    <div class="alert alert-danger" role="alert">
                    The comment field is required!
                  </div>
                  )}
                </div>

                <button class="btn btn-warning btn-block p-3 " type="submit">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </main>
      </Header>
    </>
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

  console.log("paths")

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
    body,
    slug,
    author -> {
  image,
    name
  },
  categories,
  }
  `
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
      params,
    },
  }
}

export const myPortableTextComponents = {
  types: {
    image: ({ value }) => <img src={value.imageUrl} />,
    callToAction: ({ value, isInline }) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
      ),
  },
  block: {
    // Ex. 1: customizing common block types
    h1: ({ children }) => <h1 className="text-2xl">{children}</h1>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-purple-500">{children}</blockquote>
    ),

    // Ex. 2: rendering custom styles
    customHeading: ({ children }) => (
      <h2 className="text-lg text-primary text-purple-700">{children}</h2>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined
      return (
        <a href={value.href} rel={rel}>
          {children}
        </a>
      )
    },
  },
}
