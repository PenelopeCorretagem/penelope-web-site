import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  // Arquivos ignorados globalmente
  {
    ignores: ['dist', 'node_modules', '*.config.js'],
  },

  // Configuração principal
  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    // === TODAS AS REGRAS ===
    rules: {
      // === REGRAS BÁSICAS DO ESLINT ===
      // Aplica todas as regras recomendadas do ESLint (no-unused-vars, etc.)
      ...js.configs.recommended.rules,

      // === REGRAS DE NOMENCLATURA ===
      // Força uso de camelCase em variáveis e funções
      camelcase: [
        'error',
        {
          properties: 'never', // Não força camelCase em propriedades de objetos (útil para APIs)
          ignoreDestructuring: false, // Força camelCase ao fazer destructuring
          ignoreImports: false, // Força camelCase em nomes de imports
          ignoreGlobals: false, // Força camelCase em variáveis globais
        },
      ],

      // === REGRAS ESPECÍFICAS DO REACT ===

      // Aplica todas as regras recomendadas do React
      ...react.configs.recommended.rules,

      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',

      // Define extensões de arquivo permitidas para JSX (.js e .jsx)
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],

      // Avisa sobre uso excessivo de spreading de props: {...props}, pois props explícitas são mais verbosas, mas também mais claras
      'react/jsx-props-no-spreading': 'warn',

      // Força PascalCase em nomes de componentes JSX
      'react/jsx-pascal-case': [
        'error',
        {
          allowAllCaps: true, // Permite componentes como "HTML", "SVG"
          ignore: [], 
        },
      ],

      // === REGRAS DOS REACT HOOKS ===
      // Aplica regras básicas dos hooks (não usar em condições, etc.)
      ...reactHooks.configs.recommended.rules,
      // Avisa quando dependências estão faltando em useEffect, useMemo, etc.
      'react-hooks/exhaustive-deps': 'warn',

      // === REGRAS DE FORMATAÇÃO E ESTILO ===
      // Define indentação de 2 espaços
      indent: [
        'error',
        2,
        {
          SwitchCase: 1, // Indenta cases do switch
          ignoredNodes: ['JSXElement'], // Ignora indentação especial para JSX
        },
      ],

      // Força uso de aspas simples
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true, // Permite aspas duplas se evitar caracteres de escape
          allowTemplateLiterals: true, // Permite template literals (`string`)
        },
      ],

      // Proíbe ponto e vírgula no final das linhas
      semi: ['error', 'never'],
      // Força vírgula no final de objetos/arrays multi-linha
      'comma-dangle': ['error', 'always-multiline'],
      // Força espaço dentro de chaves de objetos: { prop: value }
      'object-curly-spacing': ['error', 'always'],
      // Proíbe espaços dentro de colchetes de arrays: [1, 2, 3]
      'array-bracket-spacing': ['error', 'never'],

      // === REGRAS DE BOAS PRÁTICAS GERAIS ===
      // Avisa sobre uso de console.log (não impede, apenas avisa)
      'no-console': 'warn',
      // Proíbe variáveis declaradas mas não utilizadas
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Ignora argumentos que começam com _ (ex: _unused)
          varsIgnorePattern: '^_', // Ignora variáveis que começam com _ (ex: _temp)
          ignoreRestSiblings: true, // Ignora variáveis em destructuring rest (...rest)
        },
      ],

      // Prefere const quando variável não é reatribuída
      'prefer-const': 'error',
      // Proíbe uso de var (use let ou const)
      'no-var': 'error',
      // Prefere template literals em vez de concatenação: `hello ${name}` vs 'hello ' + name
      'prefer-template': 'warn',

      // === REGRAS ESPECÍFICAS PARA JSX ===
      // Define onde a tag de fechamento deve ficar alinhada
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      // Define onde a tag de fechamento deve estar posicionada
      'react/jsx-closing-tag-location': 'error',
      // Proíbe espaços dentro de chaves JSX: {variable} não { variable }
      'react/jsx-curly-spacing': ['error', 'never'],
      // Proíbe espaços ao redor do = em props: prop="value" não prop = "value"
      'react/jsx-equals-spacing': ['error', 'never'],
      // Primeira prop vai para nova linha quando elemento tem múltiplas props
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      // Define indentação de 2 espaços para JSX
      'react/jsx-indent': ['error', 2],
      // Define indentação de 2 espaços para props
      'react/jsx-indent-props': ['error', 2],

      // Máximo de 1 prop por linha quando elemento é multi-linha
      'react/jsx-max-props-per-line': [
        'error',
        {
          maximum: 1, // 1 prop por linha
          when: 'multiline', // Só quando elemento ocupa múltiplas linhas
        },
      ],

      // Proíbe props duplicadas: <Component prop="1" prop="2" />
      'react/jsx-no-duplicate-props': 'error',
      // Proíbe uso de componentes não definidos
      'react/jsx-no-undef': 'error',

      // Define espaçamento em tags JSX
      'react/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never', // <Component/> não <Component />
          beforeSelfClosing: 'always', // <Component /> não <Component/>
          afterOpening: 'never', // <Component> não < Component>
          beforeClosing: 'never', // </Component> não </ Component>
        },
      ],

      // Define quando JSX multi-linha deve ser envolvido em parênteses
      'react/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line', // const el = (\n<div>...
          assignment: 'parens-new-line', // el = (\n<div>...
          return: 'parens-new-line', // return (\n<div>...
          arrow: 'parens-new-line', // () => (\n<div>...
          condition: 'parens-new-line', // condition ? (\n<div>...
          logical: 'parens-new-line', // && (\n<div>...
          prop: 'parens-new-line', // prop={(\n<div>...
        },
      ],

      // === REGRAS DE ACESSIBILIDADE ===
      // Exige atributo alt em todas as imagens
      'jsx-a11y/alt-text': 'error',
      // Links devem ter conteúdo textual
      'jsx-a11y/anchor-has-content': 'error',
      // Elementos clicáveis devem ter eventos de teclado correspondentes
      'jsx-a11y/click-events-have-key-events': 'warn',
      // Elementos estáticos não devem ter event handlers
      'jsx-a11y/no-static-element-interactions': 'warn',

      // === REGRAS DO REACT REFRESH ===
      // Garante que apenas componentes sejam exportados (para hot reload funcionar)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // Permite exportar constantes junto com componentes
      ],
    },
  },
]
