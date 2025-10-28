/**
 * jscodeshift transform to remove unused import specifiers and
 * prefix unused function parameters / variable identifiers with '_'.
 *
 * This is a reasonably-safe aggressive cleanup: it only renames unused
 * identifiers (prefixing with '_') and removes import specifiers that are
 * definitely not referenced in the file. It does not remove exported
 * declarations.
 */

module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Collect used identifiers (excluding declaration positions)
  const used = new Set();

  root.find(j.Identifier).forEach(path => {
    const parent = path.parent.node;
    // Skip identifiers that are part of declarations (we only want uses)
    if (
      (parent.type === 'VariableDeclarator' && parent.id === path.node) ||
      (parent.type === 'FunctionDeclaration' && parent.id === path.node) ||
      (parent.type === 'ClassDeclaration' && parent.id === path.node) ||
      (parent.type === 'ImportSpecifier') ||
      (parent.type === 'ImportDefaultSpecifier') ||
      (parent.type === 'ImportNamespaceSpecifier') ||
      (parent.type === 'TSPropertySignature') ||
      (parent.type === 'TSTypeReference')
    ) {
      return;
    }
    // For JSXIdentifiers, take the name
    used.add(path.node.name);
  });

  // Remove unused import specifiers
  root.find(j.ImportDeclaration).forEach(path => {
    const specifiers = path.node.specifiers || [];
    const newSpecs = specifiers.filter(spec => {
      if (spec.type === 'ImportSpecifier') {
        const localName = spec.local ? spec.local.name : spec.imported.name;
        return used.has(localName);
      }
      if (spec.type === 'ImportDefaultSpecifier') {
        const localName = spec.local.name;
        return used.has(localName);
      }
      if (spec.type === 'ImportNamespaceSpecifier') {
        const localName = spec.local.name;
        return used.has(localName);
      }
      return true;
    });

    if (newSpecs.length === 0) {
      j(path).remove();
    } else if (newSpecs.length !== specifiers.length) {
      path.node.specifiers = newSpecs;
    }
  });

  // Prefix unused function parameters with _
  function renameParamIfUnused(paramPath) {
    const param = paramPath.node;
    if (param.type === 'Identifier') {
      const name = param.name;
      if (!used.has(name) && !name.startsWith('_')) {
        param.name = '_' + name;
      }
    }
    // skip complex params (patterns) to avoid accidental breakage
  }

  root
    .find(j.FunctionDeclaration)
    .forEach(path => {
      path.node.params.forEach((p, idx) => renameParamIfUnused(path.get('params', idx)));
    });

  root
    .find(j.FunctionExpression)
    .forEach(path => {
      path.node.params.forEach((p, idx) => renameParamIfUnused(path.get('params', idx)));
    });

  root
    .find(j.ArrowFunctionExpression)
    .forEach(path => {
      if (Array.isArray(path.node.params)) {
        path.node.params.forEach((p, idx) => renameParamIfUnused(path.get('params', idx)));
      }
    });

  // Prefix unused variable declarators (identifiers) with _ if not exported and not used
  root.find(j.VariableDeclarator).forEach(path => {
    const id = path.node.id;
    if (id && id.type === 'Identifier') {
      const name = id.name;
      // skip if used somewhere
      if (!used.has(name) && !name.startsWith('_')) {
        // ensure not exported (parent is ExportNamedDeclaration)
        const parent = path.parent.parent && path.parent.parent.node;
        if (parent && parent.type === 'ExportNamedDeclaration') return;
        id.name = '_' + name;
      }
    }
  });

  return root.toSource({ quote: 'single' });
};
