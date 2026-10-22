// Build-time only: keyboard users can scroll long syntax-highlighted examples.
export default function accessibleCode() {
  return (tree, file) => {
    const french = String(file.path).replaceAll('\\', '/').includes('/fr/');
    const visit = node => {
      if (node.type === 'element' && node.tagName === 'pre') {
        node.properties = { ...node.properties, tabIndex: 0, role: 'region', 'aria-label': french ? 'Exemple de code' : 'Code example' };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
