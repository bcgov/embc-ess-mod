# route template
{{- define "route.tpl" }}
{{- range $host := .Values.routes }}
kind: Route
apiVersion: route.openshift.io/v1
metadata:
  name: {{ $.name }}-{{ $host.host }}-route
  labels: {{ $.labels | nindent 4 }}
  annotations:
    haproxy.router.openshift.io/hsts_header: max-age=31536000;includeSubDomains;preload
    haproxy.router.openshift.io/balance: leastconn
    haproxy.router.openshift.io/timeout: {{ $.Values.routeTimeout | default  "120s" }}
    haproxy.router.openshift.io/rate-limit-connections: 'true'
    haproxy.router.openshift.io/disable_cookies: 'true'
spec:
  host: {{ $host.host }}
  path: {{ $host.path | default "" | quote }}
  port:
    targetPort: {{ printf "%s-%s" ($.Values.port | toString) $.Values.protocol }}
  tls:
    insecureEdgeTerminationPolicy: Redirect
    termination: edge
    {{- if $host.key }}
    key: | {{ $.Files.Get $host.key | trim | nindent 6 }}
    certificate: | {{ $.Files.Get $host.certificate | trim | nindent 6 }}
    caCertificate: | {{ $.Files.Get $host.caCertificate | trim | nindent 6 }}
    {{- end }}
  to:
    kind: Service
    name: {{ $.name }}-svc
    weight: 100
---
{{- end -}}
{{- end -}}
