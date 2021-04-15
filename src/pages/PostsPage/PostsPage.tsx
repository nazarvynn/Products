import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';

import Loader from '../../components/Loader/Loader';
import PostsList from './PostsList/PostsList';
import Pagination from './Pagination/Pagination';
import { useFetchData } from '../../relay/hooks';
import { PostsQuery } from '../../relay/queries';

export default function PostsPage() {
    const PAGE_SIZE = 3;
    const { data: posts, loading, totalCount, activePage, loadByPage } = useFetchData(PostsQuery, PAGE_SIZE);
    return (
        <>
            <h1 className="my-4">Posts</h1>
            {loading && <Loader />}
            {!loading && posts?.length && (
                <>
                    <PostsList posts={posts} />
                    <Pagination
                        activePage={activePage}
                        pagesCount={Math.ceil(totalCount / PAGE_SIZE)}
                        onPageChange={(page) => loadByPage(page)}
                    />
                </>
            )}
        </>
    );
}
