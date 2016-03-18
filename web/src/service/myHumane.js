import humane from './humane';

var flatty = humane.create({
  baseCls: 'humane-flatty'
});
flatty.error = flatty.spawn({
  addnCls: 'humane-flatty-error'
});
flatty.info = flatty.spawn({
  addnCls: 'humane-flatty-info'
});
flatty.success = flatty.spawn({
  addnCls: 'humane-flatty-success'
});

export default flatty;
