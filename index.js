window.onload = function() {
    const policyGrid = document.getElementById('policyGrid');
    const numEncodingLevels = 1;

    for (let encodingLevel = 1; encodingLevel <= numEncodingLevels; encodingLevel++) {
      const policyLink = document.createElement('a');
      policyLink.href = `Encoding ${encodingLevel}/encoding_${encodingLevel}.html`;
      policyLink.textContent = `Encoding Level: ${encodingLevel}`;
      policyGrid.appendChild(policyLink);
    }  
  };
  