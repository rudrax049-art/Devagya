window.devagyaForms = Object.freeze({
  submit: async (form) => {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    let result;
    try {
      result = await response.json();
    } catch (error) {
      throw new Error('The form service returned an unreadable response.');
    }
    if (!response.ok || !result || result.success !== true) {
      throw new Error('The form service did not confirm receipt.');
    }
    return result;
  }
});
