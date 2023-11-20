const ApplicationInsights = require('applicationinsights');
const sizes = require('../report.json');

const acceptedEnvironments = ['local', 'development', 'production'];

if (process.argv.length < 3) {
  console.error(
    `Please specify an environment.\n\nUSAGE: node index.js [${acceptedEnvironments.join(
      ' | '
    )}]`
  );
  process.exit(1);
}

const environment = process.argv[2];

if (acceptedEnvironments.indexOf(environment) === -1) {
  console.error(
    `environment must be one of the following: ${acceptedEnvironments.join(
      ' , '
    )}`
  );
  process.exit(1);
}

ApplicationInsights.setup(process.env.APP_INSIGHTS_CONNECTION_STRING).start();

let client = ApplicationInsights.defaultClient;

for (let i = 0; i < sizes.length; i++) {
  const chunkName = sizes[i].label.split('/').at(-1);
  const statSize = sizes[i].statSize;
  const parsedSize = sizes[i].parsedSize;
  const gzipSize = sizes[i].gzipSize;
  if (environment === 'local') {
    console.log('\nChunk Name: ', chunkName);
    console.log('Stat Size: ', statSize);
    console.log('Parsed Size: ', parsedSize);
    console.log('Gzip Size: ', gzipSize);
  } else {
    try {
      console.log(`tracking metric for ${chunkName}`);
      client.trackMetric({
        name: `bundle size ${environment}`,
        value: gzipSize,
        properties: {
          chunkName,
          statSize,
          parsedSize,
          gzipSize,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
}
