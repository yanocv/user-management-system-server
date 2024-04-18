import express from 'express';
import { V1Router } from './versions/v1';

// WARNING: Not implements api version 2.
// import { V2Router } from './versions/v2';
const router = express.Router();

router.use('/v1', V1Router);

// WARNING: Not implements api version 2.
// router.use('/v2', V2Router);

export { router };
