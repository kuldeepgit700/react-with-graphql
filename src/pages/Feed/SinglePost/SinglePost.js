import React, { useState, useEffect } from 'react';

const SinglePost = (props) => {
  const [post, setPost] = useState({
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  });

  useEffect(() => {
    const postId = props.match.params.postId;
    const graphqlQuery = {
      query: `query FetchSinglePost($postId: ID!) {
          post(id: $postId) {
            title
            content
            imageUrl
            creator {
              name
            }
            createdAt
          }
        }
      `,
      variables: {
        postId: postId
      }
    };

    fetch('http://localhost:9090/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then((res) => res.json())
      .then((resData) => {
        const postData = resData.data.post;
        setPost({
          title: postData.title,
          author: postData.creator.name,
          image: 'http://localhost:9090/' + postData.imageUrl,
          date: new Date(postData.createdAt).toLocaleDateString('en-US'),
          content: postData.content
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.match.params.postId, props.token]);

  return (
    <section className="single-post">
      <h1>{post.title}</h1>
      <h2>
        Created by {post.author} on {post.date}
      </h2>
      <div className="single-post__image">
        <Image contain imageUrl={post.image.replace(/\//g, '/')} />
      </div>
      <p>{post.content}</p>
    </section>
  );
};

export default SinglePost;


