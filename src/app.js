const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.use((request, _response, next) => {
  const { method, url } = request;
  const log = `[${method.toUpperCase()}] ${url}`;
  console.time(log);
  next();
  console.timeEnd(log);
});

const repositories = [];

app.get("/repositories", (_request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repo = { id: uuid(), url, title, techs, likes: 0 };
  repositories.push(repo);
  return response.status(200).json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const { url, title, techs } = request.body;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  if (repoIndex < 0) return response.status(400).send();
  const repo = { ...repositories[repoIndex], url, title, techs };
  repositories.splice(repoIndex, 1, repo);
  return response.status(200).json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  if (repoIndex < 0) return response.status(400).send();
  delete repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  if (repoIndex < 0) return response.status(400).send();
  const repo = {
    ...repositories[repoIndex],
    likes: repositories[repoIndex].likes + 1,
  };
  repositories.splice(repoIndex, 1, repo);
  return response.status(200).json({ likes: repo.likes });
});

module.exports = app;
