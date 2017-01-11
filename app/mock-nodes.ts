import { NodeDTO } from "./lazy-loaded-tree-view/nodeDTO";

export const NODES : NodeDTO[] = [
  {"id": 1, "name": "Usa", "nodeType": "country", "hasChildren": true, "idFather": 0, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 2, "name": "Australia", "nodeType": "country", "hasChildren": false, "idFather": 0, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 3, "name": "Germany", "nodeType": "country", "hasChildren": false, "idFather": 0, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 4, "name": "Norway", "nodeType": "country", "hasChildren": false, "idFather": 0, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 5, "name": "Canada", "nodeType": "country", "hasChildren": false, "idFather": 0, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 101, "name": "New York", "nodeType": "city", "hasChildren": true, "idFather": 1, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 102, "name": "Chicago", "nodeType": "city", "hasChildren": false, "idFather": 1, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 103, "name": "Los Angeles", "nodeType": "city", "hasChildren": false, "idFather": 1, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 104, "name": "Miami", "nodeType": "city", "hasChildren": false, "idFather": 1, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 105, "name": "Boston", "nodeType": "city", "hasChildren": false, "idFather": 1, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 10001, "name": "Brooklyn", "nodeType": "borough", "hasChildren": true, "idFather": 101, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 10002, "name": "Manhattan", "nodeType": "borough", "hasChildren": false, "idFather": 101, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 10003, "name": "Bronx", "nodeType": "borough", "hasChildren": false, "idFather": 101, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 10004, "name": "Queens", "nodeType": "borough", "hasChildren": false, "idFather": 101, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 10005, "name": "Staten Island", "nodeType": "borough", "hasChildren": false, "idFather": 101, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 1000001, "name": "Williamsburg", "nodeType": "neighborhood", "hasChildren": false, "idFather": 10001, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 1000002, "name": "Park Slope", "nodeType": "neighborhood", "hasChildren": false, "idFather": 10001, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 1000003, "name": "Fort Green", "nodeType": "neighborhood", "hasChildren": false, "idFather": 10001, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 1000004, "name": "Flatbush", "nodeType": "neighborhood", "hasChildren": false, "idFather": 10001, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0},
  {"id": 1000005, "name": "Red Hook", "nodeType": "neighborhood", "hasChildren": false, "idFather": 10001, "url": "", "locked": false, "lockedBy": "pippo", "projectDisciplineId": 0}
];
