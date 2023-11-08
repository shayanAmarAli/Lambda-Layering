import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment"
import * as s3Bucket from "aws-cdk-lib/aws-s3"
import * as AWS from 'aws-sdk';

export class MyStackALF extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = s3Bucket.Bucket.fromBucketName(this, 'Bucket', 'finalbucketalf');
    const layerCode = lambda.Code.fromBucket(bucket, 'nodejs.zip');

    const layer = new lambda.LayerVersion(this, 'MyLayeracl03', {
      code: layerCode,
      compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
      description: 'A layer to include node_modules',
    });

    const fn = new lambda.Function(this, 'MyFunctionacl03', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset("lambda-fns"),
      layers: [layer],
    });

    bucket.grantReadWrite(fn);
    
  }
}
