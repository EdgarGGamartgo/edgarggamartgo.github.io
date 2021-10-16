/**
 * React, Gatsby, Jest, TypeScript, Apollo - Starter
 * https://github.com/eduard-kirilov/gatsby-ts-apollo-starter
 * Copyright (c) 2020 Eduard Kirilov | MIT License
 */
import React, { FC, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/client';
import { Grid, Button, Box } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';

import { PRODUCTS_QUERY } from 'gql/query';
import { addToCart } from 'stores/cart/selected/actions';
import { LinearStatus } from 'components/status';
import { CardProduct } from 'components/card';
import { IProducts, IProduct } from 'utils/interface';
import { actions, get } from 'stores/admin/table';

import { Title5 } from 'components/typography';

const { setPage } = actions;
const { getPage, getPerPage, getDirection } = get;

const mock_podroducts = [
  {
    _id: '1',
    url: 'data:image/jpeg;base64,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',
    title: 'Aprende a aprender idiomas',
    subtitle: 'Nuestro libro oficial',
    price: '$ 100.00 MXN'
  },
  {
    _id: '2',
    url: 'data:image/jpeg;base64,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',
    title: 'Aprende a aprender idiomas (Audio libro)',
    subtitle: 'Nuestro audio libro oficial',
    price: '$ 100.00 MXN'
  }
]

const ProductsComposeMemo: FC = () => {
  const page = useSelector(getPage);
  const perPage = useSelector(getPerPage);
  const direction = useSelector(getDirection);
  const dispatch = useDispatch();
  const { data, fetchMore, loading } = useQuery<IProducts>(PRODUCTS_QUERY, {
    variables: {
      per_page: perPage,
      page: 0,
      direction,
    },
  });

  const products =
    data && data.products && data.products.data ? data.products.data : [];
  const total =
    data && data.products && data.products.data ? data.products.total : 0;

  const loadMore = (newPage: number = page) => fetchMore({
      query: PRODUCTS_QUERY,
      variables: {
        per_page: perPage,
        page: newPage,
        direction,
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          products: {
            ...prev.products,
            data: [...prev.products.data, ...fetchMoreResult.products.data],
            page: fetchMoreResult.products.page,
            total: fetchMoreResult.products.total,
          },
        };
      },
    });

  const handleLoadMore = () => {
    if (products.length < total) {
      const newPage: number = page + 1;
      dispatch(setPage(newPage));
      loadMore(newPage);
    }
  };

  const addToCard = (id: string) => dispatch(addToCart(id));

  return (
    <>
      <Title5 weight="bold" mb="40">Productos</Title5>
      <Grid container spacing={3}>
        {loading ? (
          <LinearStatus />
        ) : (
          mock_podroducts.map((item: IProduct) => (
            <CardProduct
              key={item._id}
              _id={item._id}
              url={item.url}
              price={item.price}
              title={item.title}
              addToCard={addToCard}
              subtitle={item.subtitle}
            />
          ))
        )}
      </Grid>
      {products.length < total && (
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<CloudDownload />}
            onClick={handleLoadMore}
          >
            More product
          </Button>
        </Box>
      )}
    </>
  );
};

export const ProductsCompose = memo(ProductsComposeMemo);
