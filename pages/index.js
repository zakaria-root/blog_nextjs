
import Image from "next/image"
import Header from "../components/Header/Header"
import styles from "../styles/Home.module.css"
import { sanityClient } from "../sanity"
import { urlFor } from "../sanity"
import Link from "next/link"

export default function Home({ posts }) {
  console.log(posts)
  return (
    <div className={styles.container}>
    
      <main className={styles.main}>
        <Header />
        <div className=" container d-flex bg-warning text-light p-5 border-black border-3 border-bottom">
          <div>
            <h1>
              <u>Profile</u> is a place to write, read and connect
            </h1>
            <p>
              it's easy and fee to post your thinking on any topic and connect
              with million of readers
            </p>
          </div>
          <img
            className="ms-5"
            src="https://pngimg.com/uploads/letter_p/letter_p_PNG117.png"
            width="250"
          />
        </div>
        <div className="container">
          <div className="row">
            

            {posts.map((post) => {
              return (
                <Link key={post.id} href={`/post/${post.slug.current}`}>
                    <div id={styles.element}  className="card col-lg mt-5 ms-3 p-0">
                    <div className="view overlay zoom">
                      <img
                        className="card-img-top"
                        src={urlFor(post.mainImage).url()}
                        alt="Card image cap"
                      />
                      <a href="#!">
                        <div class="mask rgba-white-slight"></div>
                      </a>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <img
                          className="z-depth-2 rounded-circle"
                          src={urlFor(post.author.image).url()}
                          alt="author image"
                          width="40"
                          height="40"
                        />
                        <h4 className="card-title ps-3">{post.title} </h4>
                      </div>
                      <hr />
                      <p className="card-text">{post.description || ""}</p>
                    </div>
                  </div>
                  
                </Link>
              )
            })}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>

      <script type="text/javascript" src="js/jquery.min.js"></script>
      <script type="text/javascript" src="js/popper.min.js"></script>
      <script type="text/javascript" src="js/bootstrap.min.js"></script>
      <script type="text/javascript" src="js/mdb.min.js"></script>
      <script src="./js/addons/datatables.min.js"></script>
      <script
        type="text/javascript"
        src="node_modules/mdbootstrap/js/mdb.min.js"
      ></script>
    </div>
  )
}

export async function getStaticProps() {
  const query = `*[_type =="post"]{
    _id,
    title,
    mainImage,
    description,
    author -> {
  image,
    name
  },
  categories,
  slug{current}
  }
    `
  const posts = await sanityClient.fetch(query)
  return {
    props: {
      posts,
    },
  }
}
