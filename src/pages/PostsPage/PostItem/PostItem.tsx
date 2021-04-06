import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Post } from '../../../core/models';
import formatDate from '../../../utils/formatDate';

export default function PostItem({
    id,
    title,
    body,
    user,
    image = 'http://placehold.it/750x300',
    createdAt = +new Date(),
}: Post) {
    const readMoreLink = `/posts/${id}`;
    const date = formatDate(createdAt);

    return (
        <article className="card mb-4">
            <img className="card-img-top" src={image} alt="placehold-750x300" />
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p className="card-text">{body}</p>
                <Link to={readMoreLink} className="btn btn-primary">
                    Read More &rarr;
                </Link>
            </div>
            <div className="card-footer text-muted">
                Posted on {date} by &nbsp;
                <Link to="/posts">{user}</Link>
            </div>
        </article>
    );
}

PostItem.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    image: PropTypes.string,
    createdAt: PropTypes.number.isRequired,
};
