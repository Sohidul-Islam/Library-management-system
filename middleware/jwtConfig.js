const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const usersModel = require("../models/usersModel");

exports.verifyToken = async (req, res, next) => {
    try {
        const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers["x-access-token"];
        if (!token) {
            return res.status(403).send({
                tokenCheck: "no_token",
                message: "Please signin into your account",
            });
        }
        const { email, expiresIn } = await jwt.verify(token, process.env.JWT_SECRET);
        // If token has expired
        if (expiresIn < Date.now().valueOf() / 1000) {
            return res.status(401).json({
                tokenCheck: "expired_token",
                error: "JWT token has expired, please login to obtain a new one",
            });
        }
        req.email = email;
        next();
    } catch (error) {
        next(error);
    }
};

exports.isPatient = async (req, res, next) => {
    const data = await usersModel.findByFields(
        (fields = {
            email: req.email,
        })
    );
    if (data[0].role === "patient") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require patient Role!",
    });

    return;
};

exports.isDoctor = async (req, res, next) => {
    const data = await usersModel.findByFields(
        (fields = {
            email: req.email,
        })
    );
    if (data[0].role === "doctor") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require doctor Role!",
    });

    return;
};
exports.isAdmin = async (req, res, next) => {
    const data = await usersModel.findByFields(
        (fields = {
            email: req.email,
        })
    );
    if (data[0].role === "admin") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require Admin Role!",
    });

    return;
};

exports.isAdminOrDoctor = async (req, res, next) => {
    const data = await usersModel.findByFields(
        (fields = {
            email: req.email,
        })
    );
    if (data[0].role === "doctor" || data[0].role === "admin") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require Admin or Doctor Role!",
    });

    return;
};

exports.isAdminOrPatient = async (req, res, next) => {
    const data = await usersModel.findByFields(
        (fields = {
            email: req.email,
        })
    );
    if (data[0].role === "patient" || data[0].role === "admin") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require patient or Doctor Role!",
    });

    return;
};

exports.isAdminOrDoctorOrPatient = async (req, res, next) => {
    const data = await usersModel.findByFields(
        (fields = {
            email: req.email,
        })
    );
    if (data[0].role === "doctor" || data[0].role === "admin" || data[0].role === "patient") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require Admin or Doctor or Patient Role!",
    });

    return;
};
