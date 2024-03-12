# secrets template
{{- define "secret.tpl" }}
{{- if or .Values.secrets .Values.secretFiles }}
kind: Secret
apiVersion: v1
metadata:
  name: {{ .name }}-secret
  labels: {{ .labels | nindent 4 }}
data:
  {{- range $key, $value := .Values.secrets }}
  {{ $key }}: {{ $value | toString | b64enc | quote }}
  {{ end -}}
  {{- if (.Values.secretFiles).files -}}
  {{- range $file := .Values.secretFiles.files }}
  {{ base $file }}: {{ ($.Files.Get $file) | b64enc | quote }}
  {{- end -}}
  {{ end -}}
{{- end -}}
{{- end -}}