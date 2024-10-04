function getEnv(name: string): string | undefined {
  return (
    window?.configs?.[`VITE_APP_${name}`] ||
    window?.configs?.[name] ||
    import.meta.env[`VITE_APP_${name}`] ||
    import.meta.env[name]
  );
}

export default getEnv;
