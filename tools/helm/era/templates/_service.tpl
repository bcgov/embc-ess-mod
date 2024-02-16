# service template
{{- define "service.tpl" -}}
{{- if .Values.port }}
kind: Service
apiVersion: v1
metadata:
  name: {{ .name }}-svc
  labels: {{ .labels | nindent 4 }}
  annotations:
    service.alpha.openshift.io/serving-cert-secret-name: {{ .name }}-ssl
spec:
  selector:
    name: {{ .name }}
  ports:
    - name: {{ printf "%s-%s" (.Values.port | toString) .Values.protocol }}
      port: {{ .Values.port }}
      protocol: {{ .Values.protocol | upper }}
      targetPort: {{ .Values.targetPort }}
  type: ClusterIP
{{- end -}}
{{- end -}}
