import React from 'react';
import Layout from '@layout';
import { getAllProducts } from '@core_modules/mymodule/services/graphql';
import {
    Box, Card, CardActionArea, CardContent, CardMedia, Grid,
} from '@root/node_modules/@material-ui/core/index';
import CircularLoading from '@common_circularloading';
import useStyles from './styles';

const CoreDefault = (props) => {
    const { data, loading } = getAllProducts();
    const classes = useStyles();

    const config = {
        title: 'My Module Page',
        header: 'relative',
        headerTitle: 'My Module Page',
        bottomNav: false,
    };

    if (loading) {
        return (
            <Layout pageConfig={config} {...props}>
                <CircularLoading />
            </Layout>
        );
    }

    return (
        <Layout pageConfig={config} {...props}>
            <div>
                <h1>Products</h1>
                <Box>
                    <Grid container>
                        <Grid item>
                            <Grid container justifyContent="center">
                                {data.products.items.map((item) => (
                                    <Grid key={item.id} item xl={3} lg={3} md={2} sm={1} xs={1} spacing={2}>
                                        <Card className={classes.card}>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    alt={item.small_image.label}
                                                    image={item.small_image.url}
                                                    height="450px"
                                                    title={item.small_image.label}
                                                />
                                                <CardContent>
                                                    <h2>{item.name}</h2>
                                                    <h3>
                                                        Rp.
                                                        {item.price_range.maximum_price.regular_price.value}
                                                    </h3>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </Layout>
    );
};

export default CoreDefault;
