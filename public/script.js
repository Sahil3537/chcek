



  
  function toggleDesc(id) {
    const all = document.querySelectorAll('.desc');
    all.forEach(desc => {
      if (desc.id === id) {
        desc.style.display = (desc.style.display === 'block') ? 'none' : 'block';
      } else {
        desc.style.display = 'none';
      }
    });
  }

