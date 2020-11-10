function FindProxyForURL(url, host) {
  /* vLab */
  if (
  shExpMatch(host, "cdlk-240*") || 
  shExpMatch(host, "192.168.120.*") || 
  ) return "SOCKS5 127.0.0.1:9877";
  return "DIRECT"; 
}
