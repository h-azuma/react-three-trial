const removeOldDatGUI = () => {
  if (document.getElementsByClassName("dg ac").length > 0) {
    document.getElementsByClassName("dg ac")[0].childNodes[0].remove();
  }
};

export { removeOldDatGUI };
