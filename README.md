# greenladies

## Using

### Requirements

- Docker
- Docker compose

### Environment variables

Copy the `.env.example` to `.env` and fill in the missing fields.

### Installing Magento2

To install Magento2 execute the following command

```
docker-compose -f docker-compose.database.yml -f docker-compose.bootstrap.yml up
```

in the root of the project.

### Running

To run the project execute the following command

```
docker-compose -f docker-compose.database.yml -f docker-compose.yml up
```

in the root of the project.
