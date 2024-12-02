function getEnv(name: string): string | undefined {
  return (
    process.env?.[name] || window?.configs?.[name] || import.meta.env[name]
  );
}

export default getEnv;
