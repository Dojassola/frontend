/// <reference types="cypress" />
describe('Testes', () => {
  it('Deve acessar o site', () => {
    cy.visit('http://localhost:5173')
  })
  it('Deve acessar a página de login e fazer login como admin', () => {
    cy.visit('http://localhost:5173')
    cy.get('nav').should('contain', 'Login')
    cy.get('nav > :nth-child(2)').click()
    cy.get('[placeholder="CPF"]').type('11111111111')
    cy.get('[placeholder="Senha"]').type('admin')
    cy.get('form > button').click()
  })
  it('Deve acessar a página de cadastro e cadastrar um novo usuário', () => {
    cy.visit('http://localhost:5173')
    cy.get('nav').should('contain', 'Login')
    cy.get('nav > :nth-child(2)').click()
    cy.get('[placeholder="CPF"]').type('11111111111')
    cy.get('[placeholder="Senha"]').type('admin')
    cy.get('form > button').click()
    cy.wait(1000) // Espera um segundo para garantir que o login foi processado
    cy.get('nav').contains('Admin').click();
    cy.get('.tab-buttons').contains('Usuários').click();
    cy.get('[placeholder="Nome"]').type('Usuario de teste')
    cy.get('[placeholder="CPF"]').type('310.210.350-25')
    cy.get('[placeholder="Senha"]').type('aluno123456')
    cy.get('.form > select').select('Aluno');
    cy.get('.form > button').click()
  })
  it('Deve acessar a página de login e fazer login como funcionário e criar um relatorio', () => {
    cy.visit('http://localhost:5173')
    cy.get('nav').should('contain', 'Login')
    cy.get('nav').contains('Login').click();
    cy.get('[placeholder="CPF"]').type('12345678902')
    cy.get('[placeholder="Senha"]').type('password123')
    cy.get('form > button').click()
    cy.wait(1000)
    cy.get('nav').contains('Funcionario').click();
    cy.get('.tab-buttons').contains('Relatório').click();
    cy.wait(1000);
    cy.get(':nth-child(1) > select').select('ASD1234');
    cy.get('.form > button').click();
  })
})