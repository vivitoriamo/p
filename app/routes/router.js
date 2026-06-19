const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
 



 
function validarCPF(cpf) {
    if (!cpf || typeof cpf !== 'string') return false;
    cpf = cpf.replace(/[^\d]+/g, '');
 
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }
 
    let soma = 0;
    let resto;
 
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
 
    resto = (soma * 10) % 11;
 
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
 
    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
 
    resto = (soma * 10) % 11;
 
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
 
    return true;
}

router.get("/", (req, res) => {
    res.render("pages/index", {
        erros: [],
        resultado: null
    });
});
 
router.post("/calcular", (req, res) => {
    const { nome, cpf, valor } = req.body;
    const erros = [];

    if (!nome || nome.trim() === "") {
        erros.push({ msg: "Nome obrigatório" });
    } else if (nome.trim().length < 3) {
        erros.push({ msg: "Nome deve ter no mínimo 3 caracteres" });
    }
    if (!cpf || cpf.trim() === "") {
        erros.push({ msg: "CPF obrigatório" });
    } else if (!validarCPF(cpf)) {
        erros.push({ msg: "CPF inválido" });
    }


    const valorFloat = parseFloat(valor);
    if (!valor || valor.trim() === "") {
        erros.push({ msg: "Valor obrigatório" });
    } else if (isNaN(valorFloat) || valorFloat <= 0) {
        erros.push({ msg: "Valor deve ser maior que zero" });
    }
    if (erros.length > 0) {
        return res.render("index", {
            erros: erros,
            resultado: null
        });
    }
 
    let percentual = 0;
 
    if (valorFloat <= 100) {
        percentual = 2;
    } else if (valorFloat <= 500) {
        percentual = 7;
    } else if (valorFloat <= 1500) {
        percentual = 12;
    } else {
        percentual = 18;
    }
 
    const desconto = (valorFloat * percentual) / 100;
    const valorFinal = valorFloat - desconto;
 
    res.render("index", {
        erros: [],
        resultado: {
            nome,
            cpf,
            valor: valorFloat,
            percentual,
            desconto,
            valorFinal
        }
    });
});
 
module.exports = router;