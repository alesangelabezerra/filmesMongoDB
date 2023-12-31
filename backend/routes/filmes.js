const express = require('express');
const router = express.Router();
const Filme = require('../models/filmes');

const upload = require("../controllers/upload")


// Criar um novo filme
router.post('/', upload.single('image'), async (req, res) => {
  const fileName = req.file.filename

  const filme = new Filme(req.body);

  filme.imagem = fileName
  try {
    const novoFilme = await filme.save();
    res.status(201).json(novoFilme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// procurar por um nome de filme
router.post('/buscar', async (req, res) => {

  const name = req.body.name
  const filtro = new RegExp(`^${name}`, "i")

  try {
    const novoFilme = await Filme.find({nome: filtro});
    res.status(201).json(novoFilme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Listar todos os filmes
router.get('/', async (req, res) => {
  try {
    const filmes = await Filme.find();
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Atualizar um filme pelo ID
router.put('/:id', async (req, res) => {
    try {
        const filme = await Filme.findById(req.params.id);
        if (!filme) {
            return res.status(404).json({ message: "Filme não encontrado" });
        }

        Object.assign(filme, req.body);
        await filme.save();
        res.status(200).json(filme);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Deletar um filme pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await Filme.findOneAndDelete({ _id: req.params.id });
        if (!resultado) {
            return res.status(404).json({ message: "Filme não encontrado." });
        }
        res.json({ message: "Filme deletado com sucesso." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Filtrar filmes por gênero
router.get('/genero/:genero', async (req, res) => {
    try {
        const filmes = await Filme.find({ genero: req.params.genero });
        if (!filmes || filmes.length === 0) {
            return res.status(404).json({ message: "Nenhum filme encontrado para o gênero fornecido" });
        }
        res.json(filmes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// mostrar os generos disponiveis

router.get('/get-generos', async (req, res) => {
  try {
      const generos = await Filme.distinct('genero');
      res.status(200).json(generos);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


module.exports = router;
