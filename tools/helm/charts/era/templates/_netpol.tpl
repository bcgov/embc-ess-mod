# network policy template
{{- define "netpol.tpl" -}}
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: {{ .name }}-netpol
  labels: {{ .labels | nindent 4 }}
spec:
  podSelector:
    matchLabels:
      name: {{ .name }}
  {{- if and .Values.port (eq "external-app" .Values.role)}}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            network.openshift.io/policy-group: ingress
      - podSelector:
          matchLabels: {}
      ports:
        - protocol: {{ .Values.protocol | upper }}
          port: {{ .Values.port }}
  {{- end }}
  {{- if and .Values.port (eq "internal-app" .Values.role)}}
  ingress:
    - from:
        - podSelector:
            matchLabels: {}
      ports:
        - protocol: {{ .Values.protocol | upper }}
          port: {{ .Values.port }}
  {{- end }}
  {{- if .Values.egress }}
  egress: {{ tpl (.Values.egress | toYaml) $ | nindent 4 }}
  {{- end }}
{{- end -}}
