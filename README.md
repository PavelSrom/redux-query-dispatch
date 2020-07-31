A tiny utility helper for dispatching redux actions.
Inspiration from `react-query` - very similar syntax :)

## Getting started

First, install the package via running `npm install react-query-dispatch`

## Basic usage

The `useDispatch` hook needs two main things:

- A function that resolves your data
- Redux key (action type) that will be used to store the resolved data

```bash
import { useDispatch } from 'redux-query-dispatch'

// Your resolver function that fetches the data (axios / fetch API / whatever)
const getAllPosts = async () => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts`
  )

  return response.data
}

export default = () => {
	/*
	'data' is the resolved data stored both locally in the hook and in redux
	what happens under the hood is that once the data is resolved, the data
	gets stored in redux via the key provided
	*/
	const [fetchPosts, { status, data }] = useDispatch(['GET_POSTS'], getAllPosts)

	useEffect(() => {
		fetchPosts()
	}, [])

	if (status === 'loading') return <p>Loading...</p>

	return data.map(post => <p>This is post {post.id}</p>)
}
```

The 3rd parameter passed into `useDispatch` is an options object:

```bash
const [fetchPosts, { status, data }] = useDispatch(['GET_POSTS'], getAllPosts, {
	onSuccess: dispatch => {
		dispatch({type: 'SUCCESS'})
		console.log('Posts fetched!')
	},
	onError: err => console.log(err),
})
```

Alternatively, the first argument of `useDispatch` (array) can be a tuple:

```bash
// your resolver function
const getSinglePost = async id => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )

  return response.data
}

// 'postId' is passed as a second argument and used in our resolved function
const [fetchPostById, { status, data }] = useDispatch(['GET_POSTS', postId], getSinglePost, {
	onSuccess: dispatch => {
		dispatch({type: 'SUCCESS'})
		console.log('Post fetched!')
	},
	onError: err => console.log(err),
})
```

## API

```bash
const [requestFunction, { status, data, error }] = useDispatch(['REDUX_KEY', fetchArgs], fetchFunction, {
	onSuccess: dispatch => {},
	onError: err => {},
	onSettled: (dispatch, data) => {}
})
```
