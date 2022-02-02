import { Box, Card, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { Azuki } from '../shared_code/Azuki';

export default function Results(props: {
    points: Array<number>
    azukis: Array<Azuki.AzukiModel>
}) {
    return <Grid container spacing={2}
    >
        {
            props.azukis.map((azuki, idx) => {
                return <Grid item><Card>
                    <CardMedia
                        component="img"
                        height="120"
                        image={azuki.imageURL}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Azuki #{azuki.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.points[idx]} points
                        </Typography>
                    </CardContent>
                </Card>
                </Grid>
            })
        }
    </Grid>
}
