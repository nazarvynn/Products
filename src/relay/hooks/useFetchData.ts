import { useCallback, useEffect, useState } from 'react';
import { fetchQuery } from 'react-relay/hooks';

import relayEnvironment from '../../relayEnvironment';

export default function useFetchData(
    query: any,
    {
        queryVariables = {},
        pageSize = 10,
        onErrorUrl = '/posts',
    }: { queryVariables?: any; pageSize?: number; onErrorUrl?: string }
) {
    const [variables, setVariables] = useState({ ...queryVariables }) as any;
    const [page, setPage] = useState(1);
    const nextPage = () => setPage(page + 1);
    const prevPage = () => setPage(page - 1);
    const [isInitiallyEmpty, setIsInitiallyEmpty] = useState(false);
    const [isInitiallyLoaded, setIsInitiallyLoaded] = useState(false);

    const [data, setData] = useState({ isLoading: false, data: null, totalCount: 0 });
    const setIsLoading = () => {
        setData(({ data, totalCount }) => ({ isLoading: true, data, totalCount }));
    };
    const storeData = (response: any) => {
        const dataKeys = Object.keys(response || {});
        if (dataKeys?.length > 1) {
            throw new Error(
                'Looks like query returns more than one data set. "useFetchData" should return only single collection'
            );
        }
        const [dataKey] = dataKeys;
        const data = response && response[dataKey];
        const { totalCount } = response ? response[dataKey].meta || { totalCount: 0 } : { totalCount: 0 };
        setData(() => ({ isLoading: false, data, totalCount }));
    };
    const refetch = useCallback((variables) => {
        setVariables(variables);
    }, []);
    const loadByPage = useCallback((page: number = 1) => {
        setPage(page);
    }, []);

    useEffect(() => {
        setIsLoading();
        // const subscription$ = fetchQuery(relayEnvironment, query, {
        //     options: { paginate: { page, limit: pageSize } },
        // }).subscribe({ next: storeData });

        const subscription$ = fetchQuery(relayEnvironment, query, variables).subscribe({ next: storeData });
        return () => {
            subscription$.unsubscribe();
        };
    }, [query, variables]);

    useEffect(() => {
        if (data) {
            if (!isInitiallyLoaded) {
                setIsInitiallyLoaded(true);
                if (!!Object.keys(data?.data || {}).length) {
                    setIsInitiallyEmpty(true);
                }
            }
        }
    }, [data, isInitiallyLoaded]);

    console.log('data', data);

    return {
        data: data.data,
        totalCount: data.totalCount,
        loading: data.isLoading,
        activePage: page,
        isLess: page > 0,
        isMore: isInitiallyLoaded && !data.isLoading && page < Math.ceil(data.totalCount / pageSize),
        isEmpty: !Object.keys(data?.data || {}).length,
        isInitiallyEmpty,
        isInitiallyLoaded,
        nextPage,
        prevPage,
        loadByPage,
        refetch,
    };
}
