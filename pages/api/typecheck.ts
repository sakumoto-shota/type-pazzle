import type { NextApiRequest, NextApiResponse } from 'next';
import * as ts from 'typescript';
import { basicTypes } from '../../types/typescript';
import { TypeCheckRequestSchema, TypeCheckResponseSchema } from '../../types/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // CSRFトークンの検証
    const csrfToken = req.headers['x-csrf-token'] ?? '';
    const cookieToken = req.cookies['csrf-token'] ?? '';
    if (!csrfToken || !cookieToken) {
      res.status(403).json({ 
        error: 'CSRFトークンが無効です',
        details: {
          headerToken: csrfToken,
          cookieToken: cookieToken
        }
      });
      return;
    }

    if (csrfToken !== cookieToken) {
      res.status(403).json({ 
        error: 'CSRFトークンが一致しません',
        details: {
          headerToken: csrfToken,
          cookieToken: cookieToken
        }
      });
      return;
    }

    // リクエストのバリデーション
    const validationResult = TypeCheckRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.errors[0].message });
      return;
    }

    const { code } = validationResult.data;
    const fileName = 'index.ts';
    const libFileName = 'lib.d.ts';

    const compilerOptions: ts.CompilerOptions = {
      noEmit: true,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
    };

    const host: ts.CompilerHost = {
      getSourceFile: (name: string): ts.SourceFile | undefined => {
        if (name === fileName) {
          return ts.createSourceFile(name, code, ts.ScriptTarget.ESNext, true);
        }
        if (name === libFileName) {
          return ts.createSourceFile(name, basicTypes, ts.ScriptTarget.ESNext, true);
        }
        return undefined;
      },
      getDefaultLibFileName: () => libFileName,
      writeFile: () => {},
      getCurrentDirectory: () => '',
      getDirectories: () => [],
      fileExists: (name: string) => name === fileName || name === libFileName,
      readFile: (name: string) => {
        if (name === fileName) return code;
        if (name === libFileName) return basicTypes;
        return undefined;
      },
      getCanonicalFileName: (f: string) => f,
      getNewLine: () => '\n',
      useCaseSensitiveFileNames: () => false,
      directoryExists: () => true,
      getEnvironmentVariable: () => '',
    };

    const program = ts.createProgram([fileName, libFileName], compilerOptions, host);
    const diagnostics = ts.getPreEmitDiagnostics(program);

    // レスポンスのバリデーション
    const response = {
      result: diagnostics.length === 0
        ? '✅ 型チェック成功!'
        : diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n')
    };

    const responseValidation = TypeCheckResponseSchema.safeParse(response);
    if (!responseValidation.success) {
      res.status(500).json({ error: 'Invalid response format' });
      return;
    }

    res.status(200).json(responseValidation.data);
  } catch (error) {
    res.status(500).json({ success: false, message: '型チェック中にエラーが発生しました。' });
  }
} 